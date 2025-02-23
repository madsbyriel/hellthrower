using System.Windows;
using System.Windows.Controls;
using Hellthrower.Extensions;
using HellthrowerWPF.Models;
using HellthrowerWPF.Services;

namespace HellthrowerWPF.Pages;

public partial class ActivatePage : Page
{
    public ActivatePage(ActivatePageViewModel viewModel, IConfigService configService, IKeyHooker keyHooker)
    {
        ViewModel = viewModel;
        _configService = configService;
        _keyHooker = keyHooker;

        _isActive = false;
        InitializeComponent();
    }

    public readonly ActivatePageViewModel ViewModel;
    private readonly IConfigService _configService;
    private readonly IKeyHooker _keyHooker;
    private bool _isActive;
    private DateTime _lastInvoke = DateTime.Now.AddDays(-1);
    private Mutex _lock = new ();

    private void ActivateDeactivate(object sender, RoutedEventArgs e)
    {
        if (ComboBox.SelectedItem is not Loadout loadout) return;
        if (sender is not Button button) return;
        _isActive = !_isActive;

        ComboBox.IsEnabled = !_isActive;
        button.Dispatcher.Invoke(() =>
        {
            button.Content = _isActive ? "Deactivate" : "Activate";
        });

        if (_isActive)
            Activate(loadout);
        else
            Deactive();
    }

    private void Deactive()
    {
        _keyHooker.UnsubscribeAll();
    }

    private void Activate(Loadout loadout)
    {
        if (_lastInvoke.AddSeconds(1) >= DateTime.Now) return;
        _lastInvoke = DateTime.Now;
        var combActions = loadout.StratagemBindings.Map(l =>
        {
            var combination = l.Triggers.Fold((x, acc) =>
            {
                acc.Add(x.Key);
                return acc;
            }, new HashSet<int>());
            
            var sequence = Utilities.StratagemToSequence(l.Stratagem).Fold((x, acc) =>
            {
                switch (x)
                {
                    case 'w':
                        acc.Add(87);
                        break;
                    case 'a':
                        acc.Add(65);
                        break;
                    case 'd':
                        acc.Add(68);
                        break;
                    case 's':
                        acc.Add(83);
                        break;
                }

                return acc;
            }, new List<int>());
            
            
            var action = () =>
            {
                _lock.WaitOne();

                KeyboardInput.SendKey(17, false);
                sequence.ForEach(vkey =>
                {
                    Thread.Sleep(40);
                    KeyboardInput.SendKey((ushort)vkey, false);
                    Thread.Sleep(40);
                    KeyboardInput.SendKey((ushort)vkey, true);
                });
                Thread.Sleep(40);
                KeyboardInput.SendKey(17, true);
                
                _lock.ReleaseMutex();
            };

            return (combination, action);
        });
        
        _keyHooker.SubscribeCombination(combActions);
    }

    private void LoadoutChooserLoad(object sender, RoutedEventArgs e)
    {
        if (sender is not ComboBox comboBox) return;
        _configService.GetConfigModel().Loadouts.CollectionChanged += (_, _) => SetComboBox(comboBox);
        SetComboBox(comboBox);
    }

    private void SetComboBox(ComboBox comboBox)
    {
        comboBox.Items.Clear();
        if (_configService.GetConfigModel().Loadouts.Count == 0)
        {
            comboBox.Text = "No available loadouts";
            return;
        }
        _configService.GetConfigModel().Loadouts.ForEach(l => comboBox.Items.Add(l));
    }
}

public class ActivatePageViewModel
{
    
}