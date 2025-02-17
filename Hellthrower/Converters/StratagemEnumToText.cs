using System;
using Hellthrower.Models;
using Microsoft.UI.Xaml.Data;

namespace Hellthrower.Converters;

public class StratagemEnumToText : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is EStratagem stratagemEnum) return stratagemEnum.ToString();
        return value.ToString();
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}