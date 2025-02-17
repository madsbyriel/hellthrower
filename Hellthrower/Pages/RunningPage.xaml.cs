using System;
using System.Collections.Generic;
using Hellthrower.Models;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Hellthrower.Services;

namespace Hellthrower.Pages;

public sealed partial class RunningPage : Page
{
    private DateTime _lastInvoke = DateTime.UnixEpoch;
    private readonly IKeyHooker _keyHooker;
    
    // Combination reference should remain same for lifetime
    private readonly HashSet<int> _currentCombination = new();

    public RunningPage(RunningPageVM viewModel, 
        IKeyHooker keyHooker)
    {
        _keyHooker = keyHooker;
        ViewModel = viewModel;

        InitializeComponent();
    }
    
    public RunningPageVM ViewModel { get; set; }

    private void ActivateDeactivate(object sender, RoutedEventArgs e)
    {
        if (sender is not Button button) return;
        if (button.Tag is not bool active)
            active = false;
        
        if (!active)
        {
            active = true;
            
            DispatcherQueue.TryEnqueue(() =>
            {
                button.Content = "Deactivate";
                // ComboMenu.IsEnabled = false;
            });
            
            Activate();
        }
        else
        {
            active = false;

            DispatcherQueue.TryEnqueue(() =>
            {
                button.Content = "Activate";
                // ComboMenu.IsEnabled = true;
            });

            Deactive();
        }

        DispatcherQueue.TryEnqueue(() =>
        {
            button.Tag = active;
        });
    }

    private void Deactive()
    {
        // _keyHooker.UnsubscribeCombination(_currentCombination);
    }

    private void Activate()
    {
        // if (ComboMenu.SelectedItem is not Loadout loadout) return;
        
        // _keyHooker.SubscribeCombination(_currentCombination, CombinationAction);
    }

    private void CombinationAction()
    {
        if (_lastInvoke.AddSeconds(1) >= DateTime.Now) return;
        _lastInvoke = DateTime.Now;

        DispatcherQueue.TryEnqueue(() =>
        {
            // if (ComboMenu.SelectedItem is not Loadout loadout) return;
        });
    }
}