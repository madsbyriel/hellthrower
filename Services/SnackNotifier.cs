using HellthrowerWPF.Models;

namespace HellthrowerWPF.Services;

public class SnackNotifier : ISnackNotifier
{
    private readonly Queue<(string, ESnackType)> _snackbarMessages = new();
    
    public void Notify(string message, ESnackType snackType)
    {
        _snackbarMessages.Enqueue((message, snackType));
        SnackAdded?.Invoke();
    }

    public event Action? SnackAdded;
    
    public (string?, ESnackType) Dequeue()
    {
        if (_snackbarMessages.TryDequeue(out var snack))
        {
            return snack;
        }
        return (null, 0);
    }
}