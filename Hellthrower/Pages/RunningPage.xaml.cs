using Hellthrower.ViewModels;
using Microsoft.UI.Xaml.Controls;

namespace Hellthrower.Pages;

public sealed partial class RunningPage : Page
{
    public RunningPage(RunningPageVM viewModel)
    {
        ViewModel = viewModel;
        InitializeComponent();
    }

    public RunningPageVM ViewModel { get; set; }
}