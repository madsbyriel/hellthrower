using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace HellthrowerWPF.Models;

public class ConfigModel
{
    public ObservableCollection<Loadout> Loadouts = new ();
}

public class Loadout : ObservableObject
{
    private string _name = string.Empty;
    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }
    
    public readonly ObservableCollection<StratagemBinding> StratagemBindings = new ();
    
    public string Tag => $"Loadout_{Name}";
}

public class StratagemBinding : ObservableObject
{
    public readonly ObservableCollection<Trigger> Triggers = new ();

    public string Name => Stratagem.ToString();

    public EStratagem Stratagem
    {
        get => _stratagem;
        set => SetProperty(ref _stratagem, value);
    }
    private EStratagem _stratagem = EStratagem.Null;
}

public class Trigger : ObservableObject
{
    private int _key = 0;
    public int Key
    {
        get => _key;
        set => SetProperty(ref _key, value);
    }
}