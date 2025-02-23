using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using System.Xml.Linq;
using Autofac;
using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Extensions;
using HellthrowerWPF.Models;
using HellthrowerWPF.Pages;
using HellthrowerWPF.Services;

namespace HellthrowerWPF;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window
{
    public MainWindow(
        MainWindowViewModel viewModel, 
        ILifetimeScope lifetimeScope, 
        IConfigService configService,
        ILoadoutPageResolver loadoutPageResolver)
    {
        InitializeComponent();
        
        DataContext = viewModel;
        ViewModel = viewModel;
        _lifetimeScope = lifetimeScope;
        _configService = configService;
        _loadoutPageResolver = loadoutPageResolver;
        
        SetMenuItems();
        _configService.GetConfigModel().Loadouts.CollectionChanged += (_, _) => SetMenuItems();

        Closed += (_, _) => Save();
    }

    private void Save()
    {
        _configService.Save();
    }

    public readonly MainWindowViewModel ViewModel;
    private readonly ILifetimeScope _lifetimeScope;
    private readonly IConfigService _configService;
    private readonly ILoadoutPageResolver _loadoutPageResolver;

    private void SetMenuItems()
    {
        LoadoutMenu.Items.Clear();
        _configService.GetConfigModel().Loadouts.Map(x =>
        {
            var m = new MenuItem
            {
                Header = x.Name,
                Tag = x.Tag,
            };
            m.Click += SetPage;

            x.PropertyChanged += (_, _) => SetMenuItems();
            
            return m;
        }).ForEach(x =>
        {
            LoadoutMenu.Items.Add(x);
        });
    }

    private void SetPage(object sender, RoutedEventArgs e)
    {
        if (sender is not FrameworkElement element || element.Tag is not string tag)
            return;

        Page page;
        switch (tag)
        {
            case "ActivatePage":
                page = _lifetimeScope.Resolve<ActivatePage>();
                break;
            case "CreatePage":
                page = _lifetimeScope.Resolve<CreatePage>();
                break;
            default:
                var loadoutPage = _loadoutPageResolver.ResolveFromTag(tag);
                if (loadoutPage is null) return;
                page = loadoutPage;
                break;
        }

        Display.Navigate(page);
    }
}

public class MainWindowViewModel : ObservableObject
{
    public readonly ObservableCollection<Loadout> Loadouts;

    public MainWindowViewModel(IConfigService configService)
    {
        Loadouts = configService.GetConfigModel().Loadouts;
    }
}