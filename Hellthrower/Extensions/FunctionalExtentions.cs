using System;
using System.Collections.Generic;

namespace Hellthrower.Extensions;

public static class FunctionalExtentions
{
    public static IEnumerable<U> Map<T, U>(this IEnumerable<T> source, Func<T, U> map)
    {
        foreach (var item in source)
        {
            yield return map(item);
        }
    }
}