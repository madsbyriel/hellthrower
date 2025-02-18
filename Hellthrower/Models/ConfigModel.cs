using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace Hellthrower.Models;

public partial class ConfigModel : ObservableObject
{
    public readonly ObservableCollection<Loadout> Loadouts = new();
}