using System.Runtime.InteropServices;
using Hellthrower.Extensions;

namespace HellthrowerWPF.Services;

public class KeyHooker : IKeyHooker
{
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
    private Mutex _mutex = new Mutex();
    private Dictionary<HashSet<int>, Action> _dict = new();

    private event Action LoopDone;
    
    public KeyHooker()
    {
        Task.Run(CheckKeyBoard);
    }

    private void CheckKeyBoard()
    {
        while (true)
        {
            _mutex.WaitOne();
            bool[] arr = new bool[0xFE];
            
            for (int vKey = 0x01; vKey <= 0xFE; vKey++)
            {
                arr[vKey - 0x01] = (GetAsyncKeyState(vKey) & 0x8000) != 0;
                
                if (arr[vKey - 0x01])
                    OnKeyPress?.Invoke(vKey);
            }
            
            foreach (var (keys, action) in _dict)
            {
                var com = keys.Map(x => arr[x - 0x01]).Reduce((x, acc) => x && acc);
                if (com)
                    action();
            }
            
            _mutex.ReleaseMutex();
            Thread.Sleep(50);
        }
    }

    public event Action<int> OnKeyPress;

    public void SubscribeCombination(IEnumerable<(HashSet<int>, Action)> combActions)
    {
        _mutex.WaitOne();
        _dict.Clear();
        combActions.ForEach(t =>
        {
            var (set, action) = t;
            _dict.Add(set, action);
        });
        _mutex.ReleaseMutex();
    }

    
    public void UnsubscribeAll()
    {
        _mutex.WaitOne();
        _dict.Clear();
        _mutex.ReleaseMutex();
    }
}