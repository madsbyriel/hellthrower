using Autofac;

namespace HellthrowerWPF.Services;

public interface IAppConstructor
{
    IContainer Construct();
}