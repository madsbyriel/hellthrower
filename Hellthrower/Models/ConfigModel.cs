using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace Hellthrower.Models;

public partial class ConfigModel : ObservableObject
{
    [ObservableProperty] private ObservableCollection<Loadout> _loadouts = new();
}