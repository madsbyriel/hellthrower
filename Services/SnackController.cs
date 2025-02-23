using System.Windows;
using System.Windows.Media;
using HellthrowerWPF.Models;
using MaterialDesignThemes.Wpf;

namespace HellthrowerWPF.Services;

public class SnackController : ISnackController
{
    private readonly ISnackNotifier _repository;
    private readonly Snackbar _snackBar;
    private readonly Queue<(string, ESnackType)> _snackQueue = new();
    private bool _isDisplaying;

    public SnackController(ISnackNotifier repository, MainWindow mainWindow)
    {
        _repository = repository;
        _repository.SnackAdded += AddToQueue;
        _snackBar = mainWindow.TheSnack;
        _snackBar.MessageQueue = new SnackbarMessageQueue();

        _snackBar.IsActiveChanged += ActiveStatusChange;

        Task.Run(UpdateLoop);
    }

    private void UpdateLoop()
    {
        while (true)
        {
            if (_isDisplaying || _snackQueue.Count == 0) continue;
            if (!_snackQueue.TryDequeue(out var snack)) continue;
            var (msg, snackType) = snack;

            _snackBar.Dispatcher.Invoke(() =>
            {
                ChangeSnackTheme(snackType);
                _snackBar.MessageQueue?.Enqueue(msg);
            });
        }
    }

    private void ChangeSnackTheme(ESnackType snackType)
    {
        Brush background = new SolidColorBrush();
        switch (snackType)
        {
            case ESnackType.Success:
                background = new SolidColorBrush { Color = Colors.Green };
                break;
            case ESnackType.Error:
                background = new SolidColorBrush { Color = Colors.Red };
                break;
        }

        _snackBar.Dispatcher.Invoke(() =>
        {
            _snackBar.Background = background;
        });
    }

    private void ActiveStatusChange(object sender, RoutedPropertyChangedEventArgs<bool> e) => _isDisplaying = e.NewValue;

    private void AddToQueue()
    {
        while (true)
        {
            var snack = _repository.Dequeue();
            if (snack.Item1 is null) return;
            
            _snackQueue.Enqueue((snack.Item1, snack.Item2));
        }
    }
}