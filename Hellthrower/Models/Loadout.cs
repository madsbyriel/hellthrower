using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace Hellthrower.Models;

public partial class Loadout : ObservableObject
{
    [ObservableProperty] private string _name = string.Empty;
    [ObservableProperty] private EStratagem _stratagem = EStratagem.Null;
    [ObservableProperty] private ObservableCollection<int> _keys = new();
}