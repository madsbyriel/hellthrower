using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Models;
using Hellthrower.Services;

namespace Hellthrower.ViewModels;

public partial class MainWindowVM : VMBase
{
    [ObservableProperty] private ConfigModel _config;
    [ObservableProperty] private object _selectedContent;
    
    private readonly IConfigService _configService;

    public MainWindowVM(IConfigService configService)
    {
        _configService = configService;

        _config = _configService.GetConfigModel();
    }
}