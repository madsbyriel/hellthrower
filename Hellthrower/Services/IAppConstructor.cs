using Autofac;

namespace Hellthrower.Services;

public interface IAppConstructor
{
    IContainer Construct();
}