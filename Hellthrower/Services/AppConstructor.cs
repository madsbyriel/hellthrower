using Autofac;
using Hellthrower.Pages;
using Hellthrower.ViewModels;

namespace Hellthrower.Services;

public class AppConstructor : IAppConstructor
{
    public IContainer Construct()
    {
        var builder = new ContainerBuilder();
        
        builder.RegisterType<ConfigService>().As<IConfigService>().SingleInstance();
        
        builder.RegisterType<MainWindowVM>().SingleInstance();
        builder.RegisterType<RunningPageVM>().SingleInstance();
        builder.RegisterType<CreateLoadoutPageVM>().SingleInstance();
        
        builder.RegisterType<MainWindow>().SingleInstance();
        builder.RegisterType<RunningPage>().SingleInstance();
        builder.RegisterType<CreateLoadoutPage>().SingleInstance();
        
        return builder.Build();
    }
}