using System;
using Windows.UI.Core;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;

namespace Hellthrower.Pages;

public sealed partial class CreateLoadoutPage : Page
{
    private bool _isListening;

    public CreateLoadoutPage(CreateLoadoutPageVM viewModel)
    {
        ViewModel = viewModel;
        InitializeComponent();
    }

    private void OnKeyDown(object sender, KeyRoutedEventArgs e)
    {
        if (_isListening)
        {
            _isListening = false;
            ListeningButton.KeyDown -= OnKeyDown;

            ListeningButton.Content = e.Key.ToString();
        }
        
    }

    private void OnPointerPressed(object sender, PointerRoutedEventArgs e)
    {
        if (_isListening)
        {
            _isListening = false;
            ListeningButton.PointerPressed -= OnPointerPressed;
            var properties = e.GetCurrentPoint(ListeningButton).Properties;
            ListeningButton.Content = properties.PointerUpdateKind.ToString();
        }
    }

    public CreateLoadoutPageVM ViewModel { get; set; }

    private void OnFindKeyClick(object sender, RoutedEventArgs e)
    {
        _isListening = true;
        ListeningButton.KeyDown += OnKeyDown;
        ListeningButton.PointerPressed += OnPointerPressed;
        ListeningButton.Content = "Listening...";
    }
}