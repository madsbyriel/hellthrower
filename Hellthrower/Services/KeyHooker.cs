using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Hellthrower.Extensions;

namespace Hellthrower.Services;

public class KeyHooker : IKeyHooker
{
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
    
    private Dictionary<HashSet<int>, (Action, bool)> _dict = new();

    private event Action LoopDone;
    
    public KeyHooker()
    {
        Task.Run(CheckKeyBoard);
    }

    private void CheckKeyBoard()
    {
        while (true)
        {
            LoopDone?.Invoke();

            bool[] arr = new bool[0xFE];
            
            for (int vKey = 0x01; vKey <= 0xFE; vKey++)
            {
                arr[vKey - 0x01] = (GetAsyncKeyState(vKey) & 0x8000) != 0;
                
                if (arr[vKey - 0x01])
                    OnKeyPress?.Invoke(vKey);
            }
            
            foreach (var (keys, (action, expr)) in _dict)
            {
                var com = keys.Map(x => arr[x - 0x01]).Reduce((x, acc) => x && acc);
                if (com)
                    action();
            }
            
            Thread.Sleep(50);
        }
    }

    public event Action<int> OnKeyPress;

    public void SubscribeCombination(HashSet<int> keyCombination, Action action)
    {
        LoopDone += Add;
        void Add()
        {
            _dict.Add(keyCombination, (action, true));
            LoopDone -= Add;
        }
    }

    
    public void UnsubscribeCombination(HashSet<int> keyCombination)
    {
        LoopDone += Remove;

        void Remove()
        {
            _dict.Remove(keyCombination);
            LoopDone -= Remove;
        }
    }
}