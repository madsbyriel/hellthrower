using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Models;
using Hellthrower.Services;

namespace Hellthrower.ViewModels;

public partial class ViewLoadoutPageVM : VMBase
{
    [ObservableProperty] private Loadout _loadout;
    private readonly IConfigService _configService;

    public ViewLoadoutPageVM(Loadout loadout, IConfigService configService)
    {
        _loadout = loadout;
        _configService = configService;
    }
}