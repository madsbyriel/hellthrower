using System;
using System.Linq;
using Autofac;
using Hellthrower.Pages;
using Hellthrower.Services;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace Hellthrower;
public sealed partial class MainWindow : Window
{
    public MainWindowVM ViewModel { get; set; }
    private readonly ILifetimeScope _lifetimeScope;
    private readonly IViewLoadoutPageResolver _loadoutPageResolver;
    private readonly IConfigService _configService;

    public MainWindow(MainWindowVM viewModel, ILifetimeScope lifetimeScope, IViewLoadoutPageResolver loadoutPageResolver)
    {
        ViewModel = viewModel;
        _lifetimeScope = lifetimeScope;
        _loadoutPageResolver = loadoutPageResolver;
        _configService = lifetimeScope.Resolve<IConfigService>();
        
        InitializeComponent();
        Activate();

        Closed += OnClose;
    }

    private void OnClose(object sender, WindowEventArgs args)
    {
        _configService.Save();
    }

    private void OnSelectedContentChange(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
    {
        if (args.SelectedItem is not NavigationViewItem item || item.Tag is not string tag)
        {
            ViewModel.SelectedContent = _lifetimeScope.Resolve<RunningPage>();
            return;
        }

        switch (tag)
        {
            case "RunningWindow":
                ViewModel.SelectedContent = _lifetimeScope.Resolve<RunningPage>();
                return;
            case "CreateWindow":
                ViewModel.SelectedContent = _lifetimeScope.Resolve<CreateLoadoutPage>();
                return;
        }

        if (tag.StartsWith("Loadout:"))
        {
            var loadoutName = tag.Split("Loadout:")[^1];
            var loadout = _configService.GetConfigModel().Loadouts.FirstOrDefault(x => x.Name == loadoutName);
            
            if (loadout == null)
                throw new Exception("Did not recognize loadout!");

            ViewModel.SelectedContent = _loadoutPageResolver.ResolveLoadoutPage(loadout);
        }
    }
}