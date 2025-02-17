using CommunityToolkit.Mvvm.ComponentModel;

namespace Hellthrower.Models;

public partial class Trigger : ObservableObject
{
    [ObservableProperty] private int _key;
    [ObservableProperty] private bool _isKeyboard;
}