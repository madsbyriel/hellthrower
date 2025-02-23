using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Extensions;
using HellthrowerWPF.Converters;
using HellthrowerWPF.Models;
using HellthrowerWPF.Services;
using Trigger = HellthrowerWPF.Models.Trigger;

namespace HellthrowerWPF.Pages;

public partial class LoadoutPage : Page
{
    private readonly IKeyHooker _keyHooker;
    public readonly LoadoutPageViewModel ViewModel;
    private readonly IConfigService _configService;
    private readonly ISnackNotifier _snackNotifier;

    public LoadoutPage(Loadout loadout, LoadoutPageArgs args)
    {
        ViewModel = new(loadout);
        DataContext = ViewModel;
        _configService = args.ConfigService;
        _snackNotifier = args.SnackNotifier;
        _keyHooker = args.KeyHooker;

        loadout.StratagemBindings.CollectionChanged += (_, _) => SetListViewItems();
        
        InitializeComponent();
    }

    private void AddStratagemBinding(object sender, RoutedEventArgs e)
    {
        if (StratagemComboBox.SelectedItem is not TextBlock tb || tb.Tag is not EStratagem stratagem ||
            stratagem == EStratagem.Null) return;
        
        StratagemBinding stratagemBinding = new();
        stratagemBinding.Stratagem = stratagem;
        
        ViewModel.Load.StratagemBindings.Add(stratagemBinding);
        stratagemBinding.PropertyChanged += (_, _) => SetListViewItems();
    }

    private void SetListViewItems()
    {
        StratagemsToShow.Items.Clear();
        foreach (var binding in ViewModel.Load.StratagemBindings)
            StratagemsToShow.Items.Add(binding);
    }

    private void ChangeName(object sender, RoutedEventArgs e)
    {
        if (_configService.GetConfigModel().Loadouts.FirstOrDefault(x => x.Name == NameBox.Text) != null)
        {
            _snackNotifier.Notify($"Loadout with name '{NameBox.Text}' already exists.", ESnackType.Error);
            NameBox.Text = ViewModel.Load.Name;
            return;
        }

        if (string.IsNullOrEmpty(NameBox.Text))
        {
            _snackNotifier.Notify($"Loadout must have a name.", ESnackType.Error);
            NameBox.Text = ViewModel.Load.Name;
            return;
        }
        
        ViewModel.Load.Name = NameBox.Text;
        _snackNotifier.Notify($"Successfully changed loadout name to '{NameBox.Text}'!", ESnackType.Success);
    }

    private void StratagemComboBoxLoad(object sender, RoutedEventArgs e)
    {
        if (sender is not ComboBox comboBox) return;
        foreach (var stratenum in Enum.GetValues(typeof(EStratagem)))
        {
            comboBox.Items.Add(new TextBlock()
            {
                Text = stratenum.ToString(),
                Tag = stratenum
            });
        }
    }

    private void DeleteStratagem(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.Tag is not StratagemBinding binding) return;
        ViewModel.Load.StratagemBindings.Remove(binding);
    }

    private void AddBinding(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.Tag is not StratagemBinding binding) return;
        binding.Triggers.Add(new());
    }

    private void BindingsViewLoaded(object sender, RoutedEventArgs e)
    {
        if (sender is not ItemsControl itemsControl || itemsControl.Tag is not StratagemBinding binding) return;
        itemsControl.Items.Clear();
        binding.Triggers.ForEach(x => itemsControl.Items.Add(x));
        binding.Triggers.CollectionChanged += (_, _) =>
        {
            itemsControl.Items.Clear();
            binding.Triggers.ForEach(x => itemsControl.Items.Add(x));
        };
    }

    private void ListenForKey(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.DataContext is not Trigger trigger) return;
        button.Content = "Listening...";
        _keyHooker.OnKeyPress += KeyHookerOnOnKeyPress;

        void KeyHookerOnOnKeyPress(int obj)
        {
            trigger.Key = obj;

            button.Dispatcher.Invoke(() =>
            {
                button.Content = Utilities.KeyToReadableString(obj);
            });
            
            _keyHooker.OnKeyPress -= KeyHookerOnOnKeyPress;
        }
    }

    private void DeleteKeybind(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.DataContext is not Trigger trigger) return;
        ViewModel.Load.StratagemBindings.ForEach(bindings =>
        {
            bindings.Triggers.Remove(trigger);
        });
    }

    private void OnLoadouts(object sender, RoutedEventArgs e)
    {
        SetListViewItems();
    }
}

public class LoadoutPageArgs
{
    public IConfigService ConfigService { get; }
    public ISnackNotifier SnackNotifier { get; }
    public IKeyHooker KeyHooker { get; }

    public LoadoutPageArgs(IConfigService configService, ISnackNotifier snackNotifier, IKeyHooker keyHooker)
    {
        ConfigService = configService;
        SnackNotifier = snackNotifier;
        KeyHooker = keyHooker;
    }
}

public class LoadoutPageViewModel : ObservableObject
{
    private readonly Loadout _load;
    public Loadout Load => _load;

    public LoadoutPageViewModel(Loadout load)
    {
        _load = load;
    }
}
