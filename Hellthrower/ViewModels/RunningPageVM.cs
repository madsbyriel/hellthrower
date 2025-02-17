using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Models;
using Hellthrower.Services;
using Microsoft.UI.Xaml;

namespace Hellthrower.ViewModels;

public partial class RunningPageVM : VMBase
{
    public ObservableCollection<Loadout> Loadouts => _loadouts;
    private ObservableCollection<Loadout> _loadouts;

    public RunningPageVM(IConfigService configService)
    {
        _loadouts = configService.GetConfigModel().Loadouts;
    }
}