using CommunityToolkit.Mvvm.ComponentModel;

namespace Hellthrower.ViewModels;

public partial class CreateLoadoutPageVM : VMBase
{
    [ObservableProperty] private string _name = "";
    [ObservableProperty] private int _stratagem = 0;
    
    public CreateLoadoutPageVM()
    {
    }
}