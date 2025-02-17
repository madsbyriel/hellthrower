using System.Collections.ObjectModel;
using System.Runtime.CompilerServices;
using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.ViewModels;
using Microsoft.UI.Xaml;

namespace Hellthrower.Models;

public partial class Loadout : ObservableObject
{
    public Loadout(ObservableCollection<CreateStratagemBindingVM> stratagemBindings, string name)
    {
        StratagemBindings = stratagemBindings;
        _name = name;
    }
    
    public ObservableCollection<CreateStratagemBindingVM> StratagemBindings;
    
    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }
    
    private string _name;

    public string Tag
    {
        get => $"Loadout:{_name}";
    }
}