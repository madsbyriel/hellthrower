using System;
using System.Collections.Generic;

namespace Hellthrower.Services;

public interface IKeyHooker
{
    public event Action<int> OnKeyPress;
    public void SubscribeCombination(IEnumerable<(HashSet<int>, Action)> combActions);
    public void UnsubscribeAll();
}