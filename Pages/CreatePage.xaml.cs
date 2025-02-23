using System.Windows;
using System.Windows.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using HellthrowerWPF.Models;
using HellthrowerWPF.Services;

namespace HellthrowerWPF.Pages;

public partial class CreatePage : Page
{
    public CreatePage(CreatePageViewModel viewModel, IConfigService configService, ISnackNotifier snackNotifier)
    {
        _configService = configService;
        _snackNotifier = snackNotifier;

        ViewModel = viewModel;
        DataContext = ViewModel;
        
        InitializeComponent();
    }

    public readonly CreatePageViewModel ViewModel;
    private readonly IConfigService _configService;
    private readonly ISnackNotifier _snackNotifier;

    private void OnAdd(object sender, RoutedEventArgs e)
    {
        if (string.IsNullOrEmpty(ViewModel.Name))
        {
            _snackNotifier.Notify("Name of loadout cannot be empty!", ESnackType.Error);
            return;
        }

        if (_configService.GetConfigModel().Loadouts.FirstOrDefault(x => x.Name == ViewModel.Name) != null)
        {
            _snackNotifier.Notify("A loadout with this name already exists!", ESnackType.Error);
            return;
        }
        
        _configService.GetConfigModel().Loadouts.Add(new Loadout() { Name = ViewModel.Name });
        
        _snackNotifier.Notify($"Successfully created loadout '{ViewModel.Name}'!", ESnackType.Success);
    }
}

public class CreatePageViewModel : ObservableObject
{
    private string _name = "";

    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }
}