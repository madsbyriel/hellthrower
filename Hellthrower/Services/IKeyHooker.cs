using System;
using System.Collections.Generic;

namespace Hellthrower.Services;

public interface IKeyHooker
{
    public event Action<int> OnKeyPress;
    public void SubscribeCombination(HashSet<int> keyCombination, Action action);
    public void UnsubscribeCombination(HashSet<int> keyCombination);
}