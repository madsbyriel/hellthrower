using System;
using System.Collections.Generic;
using System.Threading;
using Windows.System;
using Hellthrower.Extensions;
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
    private readonly Mutex _lock;
    
    public RunningPage(RunningPageVM viewModel, 
        IKeyHooker keyHooker)
    { 
        _lock = new Mutex();
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
                ComboMenu.IsEnabled = false;
            });
            
            Activate();
        }
        else
        {
            active = false;

            DispatcherQueue.TryEnqueue(() =>
            {
                button.Content = "Activate";
                ComboMenu.IsEnabled = true;
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
        _keyHooker.UnsubscribeAll();
    }

    private void Activate()
    {
        if (_lastInvoke.AddSeconds(1) >= DateTime.Now) return;
        _lastInvoke = DateTime.Now;

        DispatcherQueue.TryEnqueue(() =>
        {
            if (ComboMenu.SelectedItem is not Loadout loadout) return;
            var combActions = loadout.StratagemBindings.Map(l =>
            {
                var combination = l.Triggers.Fold((x, acc) =>
                {
                    acc.Add(x.Key);
                    return acc;
                }, new HashSet<int>());

                var sequence = l.Stratagem.Sequence.Fold((x, acc) =>
                {
                    switch (x)
                    {
                        case 'w':
                            acc.Add(VirtualKey.W);
                            break;
                        case 'a':
                            acc.Add(VirtualKey.A);
                            break;
                        case 'd':
                            acc.Add(VirtualKey.D);
                            break;
                        case 's':
                            acc.Add(VirtualKey.S);
                            break;
                    }

                    return acc;
                }, new List<VirtualKey>());

                var action = () =>
                {
                    _lock.WaitOne();

                    KeyboardInput.SendKey((ushort)VirtualKey.LeftControl, false);
                    sequence.ForEach(vkey =>
                    {
                        Thread.Sleep(40);
                        KeyboardInput.SendKey((ushort)vkey, false);
                        Thread.Sleep(40);
                        KeyboardInput.SendKey((ushort)vkey, true);
                    });
                    Thread.Sleep(40);
                    KeyboardInput.SendKey((ushort)VirtualKey.LeftControl, true);
                    
                    _lock.ReleaseMutex();
                };

                return (combination, action);
            });
            
            _keyHooker.SubscribeCombination(combActions);
        });
    }
}