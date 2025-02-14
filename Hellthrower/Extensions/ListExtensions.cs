using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Hellthrower.Extensions;

public static class ListExtensions
{
    public static ObservableCollection<T> ToObservableCollection<T>(this IEnumerable<T> list)
    {
        return new ObservableCollection<T>(list);
    }
}