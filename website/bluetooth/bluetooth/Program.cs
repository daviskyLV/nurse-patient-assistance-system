﻿using InTheHand.Bluetooth;
using Microsoft.Data.Sqlite;

public static class BluetoothConnection
{
    private const string DeviceName = "Notest_UART";

    private static async Task AddRequestToDatabase(string dbPath, int room, int bed)
    {
        await using (var connection = new SqliteConnection($"Data Source={dbPath};Version=3;"))
        {
            connection.Open();
            
            // Insert the request
            const string insertQuery = "INSERT INTO NurseRequests (room_number, bed_number) VALUES (@r, @b);";
            await using (var insertCmd = new SqliteCommand(insertQuery, connection))
            {
                insertCmd.Parameters.AddWithValue("@r", room);
                insertCmd.Parameters.AddWithValue("@b", bed);

                insertCmd.ExecuteNonQuery();
            }
        }
    }
    
    private static async Task<IReadOnlyCollection<BluetoothDevice>> ScanDevices()
    {
        Console.WriteLine("Scanning for Bluetooth Low Energy (BLE) devices...");
        try
        {
            return await Bluetooth.ScanForDevicesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during scanning: {ex.Message}");
            return Array.Empty<BluetoothDevice>();
        }
    }
    
    private static async Task Main(string[] args)
    {

        var databasePath = "database.db";
        if (args.Length > 1)
        {
            databasePath = args[1]; // args[0] is executable path
        }

        while (true)
        {
            var bluetoothDevices = await ScanDevices();
            var connectedDevices = new Dictionary<BluetoothDevice, GattCharacteristic>();
            Console.WriteLine($"Found {bluetoothDevices.Count} devices");
            
            // Connecting to valid bluetooth devices
            foreach (var device in bluetoothDevices)
            {
                if (!device.Name.Equals(DeviceName))
                    continue;
                
                if (device.Gatt.IsConnected)
                    continue;
                    
                await device.Gatt.ConnectAsync();
                if (!device.Gatt.IsConnected)
                    continue;
                
                Console.WriteLine($"Connected to {device.Name}|{device.Id}");

                var services = await device.Gatt.GetPrimaryServicesAsync();
                foreach (var service in services)
                {
                    var characteristics = await service.GetCharacteristicsAsync();
                    foreach (var gattChar in characteristics)
                    {
                        if (!gattChar.Properties.HasFlag(GattCharacteristicProperties.Notify))
                            continue;
                        
                        Console.WriteLine($"Device {device.Id} has notify property! Subscribing...");
                        await gattChar.StartNotificationsAsync();
                        
                        // Handling received messages
                        gattChar.CharacteristicValueChanged += (s, e) =>
                        {
                            var data = e.Value;
                            if (data == null)
                                return;
                            
                            Console.WriteLine($"Received data from {device.Name}|{device.Id}: {BitConverter.ToString(data)}");
                            AddRequestToDatabase(databasePath, 123, -123);
                        };
                        connectedDevices.Add(device, gattChar);
                    }
                }
            }
            
            Console.WriteLine($"Waiting 30 seconds before rescanning for devices");
            Task.Delay(30000).Wait();
            
            // Disconnecting to still connected bluetooth devices
            foreach (var kvp in connectedDevices)
            {
                try
                {
                    await kvp.Value.StopNotificationsAsync();
                    kvp.Key.Gatt.Disconnect();
                    connectedDevices.Remove(kvp.Key);
                }
                catch
                {
                    // Do nothing for now
                }
            }
            connectedDevices.Clear();
        }
    }
}