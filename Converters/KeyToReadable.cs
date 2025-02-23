using System.Globalization;
using System.Windows.Data;
using System.Windows.Input;
using Hellthrower.Extensions;

namespace HellthrowerWPF.Converters;

public class KeyToReadable : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is not int obj) return null;
        
        return Utilities.KeyToReadableString(obj);
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}