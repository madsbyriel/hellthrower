using Autofac;
using HellthrowerWPF.Pages;
using IContainer = Autofac.IContainer;

namespace HellthrowerWPF.Services;

public class AppConstructor : IAppConstructor
{
    public IContainer Construct()
    {
        var builder = new ContainerBuilder();
        
        // Services
        builder.RegisterType<ConfigService>().As<IConfigService>().SingleInstance();
        builder.RegisterType<KeyHooker>().As<IKeyHooker>().SingleInstance();
        builder.RegisterType<SnackNotifier>().As<ISnackNotifier>().SingleInstance();
        builder.RegisterType<SnackController>().As<ISnackController>().SingleInstance().AutoActivate();
        builder.RegisterType<KeyHooker>().As<IKeyHooker>().SingleInstance();
        
        // Pages
        builder.RegisterType<MainWindow>().AsSelf().SingleInstance();
        builder.RegisterType<ActivatePage>().AsSelf().SingleInstance();
        builder.RegisterType<CreatePage>().AsSelf().SingleInstance();
        builder.RegisterType<LoadoutPageResolver>().As<ILoadoutPageResolver>().SingleInstance();
        
        // View models
        builder.RegisterType<MainWindowViewModel>().AsSelf().SingleInstance();
        builder.RegisterType<ActivatePageViewModel>().AsSelf().SingleInstance();
        builder.RegisterType<CreatePageViewModel>().AsSelf().SingleInstance();
        builder.RegisterType<LoadoutPageArgs>().AsSelf();
        
        return builder.Build();
    }
}