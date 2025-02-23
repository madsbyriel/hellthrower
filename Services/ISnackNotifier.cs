using HellthrowerWPF.Models;

namespace HellthrowerWPF.Services;

public interface ISnackNotifier
{
    void Notify(string message, ESnackType snackType);
    event Action? SnackAdded;
    public (string?, ESnackType) Dequeue();
}

