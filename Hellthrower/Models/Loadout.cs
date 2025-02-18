using System.Collections.ObjectModel;
using System.Runtime.CompilerServices;
using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;

namespace Hellthrower.Models;

public partial class Loadout(
    ObservableCollection<CreateStratagemBindingVM> stratagemBindings,
    string name)
    : ObservableObject
{
    public readonly ObservableCollection<CreateStratagemBindingVM> StratagemBindings = stratagemBindings;
    
    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }
    
    private string _name = name;

    public string Tag
    {
        get => $"Loadout:{_name}";
    }
}