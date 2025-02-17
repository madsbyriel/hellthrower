using Hellthrower.Models;
using Hellthrower.Services;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace Hellthrower.Pages;

public sealed partial class ViewLoadoutPage : Page
{
    private readonly IConfigService _configService;

    public ViewLoadoutPage(Loadout loadout, ViewLoadoutPageCtor staticArgs)
    {
        _configService = staticArgs.ConfigService;
        ViewModel = new ViewLoadoutPageVM(loadout, staticArgs.ConfigService);
        
        InitializeComponent();
    }

    public ViewLoadoutPageVM ViewModel { get; set; }

    private void Delete(object sender, RoutedEventArgs e)
    {
        _configService.GetConfigModel().Loadouts.Remove(ViewModel.Loadout);
    }
}

public class ViewLoadoutPageCtor
{
    public IConfigService ConfigService { get; }

    public ViewLoadoutPageCtor(IConfigService configService)
    {
        ConfigService = configService;
    }
}