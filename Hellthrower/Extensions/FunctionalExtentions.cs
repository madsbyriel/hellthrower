using System;
using System.Collections;
using System.Collections.Generic;

namespace Hellthrower.Extensions;

public static class FunctionalExtentions
{
    public static IEnumerable<U> Map<T, U>(this IEnumerable<T> source, Func<T, U> map)
    {
        foreach (var item in source)
            yield return map(item);
    }
    
    public static IEnumerable<U> Map<U>(this IEnumerable source, Func<object?, U> map)
    {
        foreach (var item in source)
            yield return map(item);
    }

    public static IList<T> Collect<T>(this IEnumerable<T> source)
    {
        List<T> list = new List<T>();
        foreach (var x in source)
            list.Add(x);
        
        return list;
    }

    public static U Fold<T, U>(this IEnumerable<T> items, Func<T, U, U> func, U initialValue)
    {
        var acc = initialValue;
        foreach (var item in items)
        {
            acc = func(item, acc);
        }

        return acc;
    }
    
    public static T Reduce<T>(this IEnumerable<T> items, Func<T, T, T> func)
    {
        var enumerator = items.GetEnumerator();
        
        if (!enumerator.MoveNext())
            return default!;
        
        T acc = enumerator.Current;
        while (enumerator.MoveNext())
            acc = func(enumerator.Current, acc);

        return acc;
    }

    public static void ForEach<T>(this IEnumerable<T> items, Action<T> action)
    {
        foreach (var item in items)
            action(item);
    }
}