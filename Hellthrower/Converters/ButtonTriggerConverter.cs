using System;
using System.Windows.Forms;
using Windows.System;
using Hellthrower.Models;
using Microsoft.UI.Input;
using Microsoft.UI.Xaml.Data;

namespace Hellthrower.Converters;

public class ButtonTriggerConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is Trigger trigger)
        {
            return ((VirtualKey)trigger.Key).ToString();
        }
        
        return value.ToString();
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}