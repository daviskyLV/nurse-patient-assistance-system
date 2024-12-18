using InTheHand.Bluetooth;

public static class BluetoothConnection
{
    private const string DeviceName = "Notest_UART";
    
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

        var databasePath = "./database.db";
        if (args.Length > 1)
        {
            databasePath = args[1]; // args[0] is executable path
        }

        while (true)
        {
            var bluetoothDevices = await ScanDevices();
            var connectedDevices = new Dictionary<BluetoothDevice, GattCharacteristic>();
            
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

                var services = await device.Gatt.GetPrimaryServicesAsync();
                foreach (var service in services)
                {
                    var characteristics = await service.GetCharacteristicsAsync();
                    foreach (var gattChar in characteristics)
                    {
                        if (!gattChar.Properties.HasFlag(GattCharacteristicProperties.Notify))
                            continue;
                        
                        // Handling received messages
                        gattChar.CharacteristicValueChanged += (s, e) =>
                        {
                            var data = e.Value;
                            Console.WriteLine($"Received data from {device.Name}|{device.Id}: {BitConverter.ToString(data)}");
                        };
                        connectedDevices.Add(device, gattChar);
                    }
                }
            }
            
            // Disconnecting to still connected bluetooth devices
            foreach (var kvp in connectedDevices)
            {
                try
                {
                    kvp.Key.Gatt.Disconnect();
                    connectedDevices.Remove(kvp.Key);
                }
                catch
                {
                    // Do nothing for now
                }
            }
        }
    }
}