using System.IO;
using HellthrowerWPF.Models;
using Newtonsoft.Json;

namespace HellthrowerWPF.Services;

public class ConfigService : IConfigService
{
    private readonly ConfigModel _config;
    private readonly string _fileName;
    
    public ConfigService()
    {
        var appdata = Environment.GetEnvironmentVariable("APPDATA");
        if (appdata == null)
            throw new Exception("Did not find environment variable: APPDATA");
        _fileName = $"{appdata}\\Hellthrower\\config.json";

        if (!File.Exists(_fileName))
        {
            var split = _fileName.Split('\\');
            var dirpath = "";
            for (int i = 0; i < split.Length - 1; i++)
            {
                dirpath += $"{split[i]}\\";
            }
            
            Directory.CreateDirectory(dirpath);
            File.Create(_fileName).Close();
        }

        string configFile = File.ReadAllText(_fileName);
        var model = JsonConvert.DeserializeObject<ConfigModel>(configFile);

        if (model is null)
        {
            _config = new ConfigModel();
        }
        else
        {
            _config = model;
        }
    }
    
    public ConfigModel GetConfigModel() => _config;

    public void Save()
    {
        File.WriteAllText(_fileName, JsonConvert.SerializeObject(_config, Formatting.Indented));
    }
}