using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Models;
using Hellthrower.Services;

namespace Hellthrower.ViewModels;

public partial class ViewLoadoutPageVM : VMBase
{
    public readonly Loadout Loadout;
    private readonly IConfigService _configService;

    public ViewLoadoutPageVM(Loadout loadout, IConfigService configService)
    {
        Loadout = loadout;
        _configService = configService;
    }
}