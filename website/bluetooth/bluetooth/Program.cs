using InTheHand.Bluetooth;

public static class BluetoothConnection
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("Scanning for Bluetooth Low Energy (BLE) devices...");
        try
        {
            Console.WriteLine($"Try catch");
            // Start scanning for devices
            var bluetoothDevices = await Bluetooth.ScanForDevicesAsync();
            Console.WriteLine($"devices found: {bluetoothDevices.Count}");
            foreach (var device in bluetoothDevices)
            {
                Console.WriteLine($"Found device:");
                Console.WriteLine($"  Name: {device.Name ?? "Unknown"}");
                Console.WriteLine($"  ID: {device.Id}");
                //Console.WriteLine($"  RSSI: {device.} dBm");
            }

            Console.WriteLine("Scan completed.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during scanning: {ex.Message}");
        }
    }
}