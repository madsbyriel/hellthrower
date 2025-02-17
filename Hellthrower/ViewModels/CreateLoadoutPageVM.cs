using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using Hellthrower.Models;
using Microsoft.UI.Xaml;

namespace Hellthrower.ViewModels;

public partial class CreateLoadoutPageVM : VMBase
{
    private string _name = string.Empty;

    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }

    public readonly ObservableCollection<CreateStratagemBindingVM> Stratagems = new();
    public ObservableCollection<Stratagem> AllStratagems => Stratagem.Stratagems;
}

public partial class CreateStratagemBindingVM(Stratagem stratagem) : VMBase
{
    public readonly ObservableCollection<Trigger> Triggers = new();
    public readonly Stratagem Stratagem = stratagem;
}