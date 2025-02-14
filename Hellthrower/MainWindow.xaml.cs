using System;
using Windows.UI.Core;
using Autofac;
using Hellthrower.Pages;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

// To learn more about WinUI, the WinUI project structure,
// and more about our project templates, see: http://aka.ms/winui-project-info.

namespace Hellthrower
{
    /// <summary>
    /// An empty window that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainWindow : Window
    {
        public MainWindowVM ViewModel { get; set; }
        private readonly ILifetimeScope _lifetimeScope;

        public MainWindow(MainWindowVM viewModel, ILifetimeScope lifetimeScope)
        {
            ViewModel = viewModel;
            _lifetimeScope = lifetimeScope;
            
            InitializeComponent();
            Activate();
        }

        private void OnSelectedContentChange(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
        {
            if (args.SelectedItem is not NavigationViewItem item || item.Tag is not string tag)
                throw new Exception("Did not recognize event args!");

            switch (tag)
            {
                case "RunningWindow":
                    ViewModel.SelectedContent = _lifetimeScope.Resolve<RunningPage>();
                    break;
                case "CreateWindow":
                    ViewModel.SelectedContent = _lifetimeScope.Resolve<CreateLoadoutPage>();
                    break;
            }
        }
    }
}
