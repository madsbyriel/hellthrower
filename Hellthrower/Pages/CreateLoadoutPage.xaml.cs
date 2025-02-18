using System;
using System.Linq;
using Windows.System;
using Hellthrower.Extensions;
using Hellthrower.Models;
using Hellthrower.Services;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Button = Microsoft.UI.Xaml.Controls.Button;

namespace Hellthrower.Pages;

public sealed partial class CreateLoadoutPage : Page
{
    private readonly IConfigService _configService;
    private readonly IKeyHooker _keyHooker;

    public CreateLoadoutPage(CreateLoadoutPageVM viewModel, IConfigService configService, IKeyHooker keyHooker)
    {
        _configService = configService;
        _keyHooker = keyHooker;
        ViewModel = viewModel;

        InitializeComponent();
    }

    public CreateLoadoutPageVM ViewModel { get; set; }

    private void ComboBoxSelected(object sender, SelectionChangedEventArgs e)
    {
        if (sender is not ComboBox comboBox || comboBox.SelectedItem is not Stratagem stratagem) return;
        ViewModel.Stratagems.Add(new(stratagem));

        DispatcherQueue.TryEnqueue(() =>
        {
            comboBox.SelectedItem = null;
        });
    }

    private void AddATrigger(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.DataContext is not CreateStratagemBindingVM trigger) return;
        trigger.Triggers.Add(new Trigger());
    }

    private void BindTrigger(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.DataContext is not Trigger trigger) return;
        if (button.Tag is not bool isListening)
        {
            button.Tag = false;
            isListening = false;
        }
        
        if (!isListening)
        {
            DispatcherQueue.TryEnqueue(() =>
            {
                isListening = true;
                button.Tag = isListening;
                button.Content = "Listening...";
                _keyHooker.OnKeyPress += OnKeyPress;
            });
        }

        void OnKeyPress(int key)
        {
            DispatcherQueue.TryEnqueue(() =>
            {
                trigger.Key = key;
                button.Content = ((VirtualKey)key).ToString();
                _keyHooker.OnKeyPress -= OnKeyPress;
                button.Tag = false;
            });
        }
    }

    private void Save(object sender, RoutedEventArgs e)
    {
        if (string.IsNullOrEmpty(ViewModel.Name))
        {
            ErrorText.Visibility = Visibility.Visible;
            ErrorText.Text = "Please enter a name.";
            return;
        }

        if (_configService.GetConfigModel().Loadouts.FirstOrDefault(x => x.Name == ViewModel.Name) != null)
        {
            ErrorText.Visibility = Visibility.Visible;
            ErrorText.Text = "Loadout with this name already exists.";
            return;
        }

        if (ViewModel.Stratagems.Count == 0)
        {
            ErrorText.Visibility = Visibility.Visible;
            ErrorText.Text = "There are no stratagems in the loadout?!";
            return;
        }
        
        ViewModel.Stratagems.ForEach(s =>
        {
            for (int i = s.Triggers.Count - 1; 0 <= i; i--)
            {
                var t = s.Triggers[i];
                if (t.Key == 0 || t.Key == null)
                    s.Triggers.RemoveAt(i);
            }
        });

        var loadout = new Loadout(ViewModel.Stratagems.Map(x => x).ToObservableCollection(), ViewModel.Name);
        
        _configService.GetConfigModel().Loadouts.Add(loadout);
        
        ErrorText.Visibility = Visibility.Collapsed;
        ErrorText.Text = string.Empty;
        
        ViewModel.Stratagems.Clear();
        ViewModel.Name = string.Empty;
    }

    private void DeleteTrigger(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.DataContext is not Trigger trigger) return;
        foreach (var createStratagemBindingVm in ViewModel.Stratagems)
        {
            if (createStratagemBindingVm.Triggers.Contains(trigger))
            {
                createStratagemBindingVm.Triggers.Remove(trigger);
                break;
            }
        }
    }

    private void OnTriggerButtonLoad(object sender, RoutedEventArgs e)
    {
        if (sender is not Button btn) return;
        btn.Content = "Bind me!";
    }

    private void DeleteStratagem(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button || button.DataContext is not CreateStratagemBindingVM vm) return;
        ViewModel.Stratagems.Remove(vm);
    }
}