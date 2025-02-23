using System.Windows;
using Autofac;
using HellthrowerWPF.Services;

namespace HellthrowerWPF;

/// <summary>
/// Interaction logic for App.xaml
/// </summary>
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        IAppConstructor constructor = new AppConstructor();
        var container = constructor.Construct();
        
        var mainWindow = container.Resolve<MainWindow>();
        
        mainWindow.Show();
    } 
}