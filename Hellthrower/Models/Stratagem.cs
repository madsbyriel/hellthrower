using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using Newtonsoft.Json;

namespace Hellthrower.Models;

public partial class Stratagem : ObservableObject
{
    [JsonConstructor]
    private Stratagem(EStratagem stratagemEnum, string sequence)
    {
        _sequence = sequence;
        _stratagemEnum = stratagemEnum;
    }

    public string Sequence
    {
        get => _sequence;
        set => SetProperty(ref _sequence, value);
    }
    private string _sequence;

    public EStratagem StratagemEnum
    {
        get => _stratagemEnum;
        set => SetProperty(ref _stratagemEnum, value);
    }
    private EStratagem _stratagemEnum;

    public static ObservableCollection<Stratagem> Stratagems { get; private set; } = new()
    {
        new Stratagem(EStratagem.MachineGun, "saswd"),
        new Stratagem(EStratagem.AntiMaterielRifle, "sadws"),
        new Stratagem(EStratagem.Stalwart, "saswwa"),
        new Stratagem(EStratagem.ExpendableAntiTank, "ssawd"),
        new Stratagem(EStratagem.RecoillessRifle, "sadda"),
        new Stratagem(EStratagem.Flamethrower, "sawsw"),
        new Stratagem(EStratagem.Autocannon, "saswwd"),
        new Stratagem(EStratagem.HeavyMachineGun, "sawss"),
        new Stratagem(EStratagem.AirburstRocketLauncher, "swwad"),
        new Stratagem(EStratagem.Commando, "sawsd"),
        new Stratagem(EStratagem.Railgun, "sdswad"),
        new Stratagem(EStratagem.Spear, "sswss"),
        new Stratagem(EStratagem.WASPLauncher, "sswsd"),
        new Stratagem(EStratagem.OrbitalGatlingBarrage, "dsaww"),
        new Stratagem(EStratagem.OrbitalAirburstStrike, "ddd"),
        new Stratagem(EStratagem.Orbital120mmHEBarrage, "ddsads"),
        new Stratagem(EStratagem.Orbital380mmHEBarrage, "dswwass"),
        new Stratagem(EStratagem.OrbitalWalkingBarrage, "dsdsds"),
        new Stratagem(EStratagem.OrbitalLaser, "dswds"),
        new Stratagem(EStratagem.OrbitalNapalmBarrage, "ddsadw"),
        new Stratagem(EStratagem.OrbitalRailcannonStrike, "dwssd"),
        new Stratagem(EStratagem.EagleStrafingRun, "wdd"),
        new Stratagem(EStratagem.EagleAirstrike, "wdsd"),
        new Stratagem(EStratagem.EagleClusterBomb, "wdssd"),
        new Stratagem(EStratagem.EagleNapalmAirstrike, "wdsw"),
        new Stratagem(EStratagem.JumpPack, "swwsw"),
        new Stratagem(EStratagem.EagleSmokeStrike, "wdws"),
        new Stratagem(EStratagem.Eagle110mmRocketPods, "wdwa"),
        new Stratagem(EStratagem.Eagle500kgBomb, "wdsss"),
        new Stratagem(EStratagem.FastReconVehicle, "asdsdsw"),
        new Stratagem(EStratagem.OrbitalPrecisionStrike, "ddw"),
        new Stratagem(EStratagem.OrbitalGasStrike, "ddsd"),
        new Stratagem(EStratagem.OrbitalEMSStrike, "ddas"),
        new Stratagem(EStratagem.OrbitalSmokeStrike, "ddsw"),
        new Stratagem(EStratagem.HMGEmplacement, "swadda"),
        new Stratagem(EStratagem.ShieldGeneratorRelay, "ssadad"),
        new Stratagem(EStratagem.TeslaTower, "swdwad"),
        new Stratagem(EStratagem.AntiPersonnelMinefield, "sawd"),
        new Stratagem(EStratagem.SupplyPack, "saswws"),
        new Stratagem(EStratagem.GrenadeLauncher, "sawas"),
        new Stratagem(EStratagem.LaserCannon, "saswa"),
        new Stratagem(EStratagem.IncendiaryMines, "saas"),
        new Stratagem(EStratagem.GuardDogLaserRover, "swawdd"),
        new Stratagem(EStratagem.BallisticShieldBackpack, "sasswa"),
        new Stratagem(EStratagem.ArcThrower, "sdswaa"),
        new Stratagem(EStratagem.AntiTankMines, "saww"),
        new Stratagem(EStratagem.QuasarCannon, "sswad"),
        new Stratagem(EStratagem.ShieldGeneratorPack, "swadad"),
        new Stratagem(EStratagem.GasMines, "saad"),
        new Stratagem(EStratagem.MachineGunSentry, "swddw"),
        new Stratagem(EStratagem.GatlingSentry, "swda"),
        new Stratagem(EStratagem.MortarSentry, "swdds"),
        new Stratagem(EStratagem.GuardDog, "swawds"),
        new Stratagem(EStratagem.AutocannonSentry, "swdwaw"),
        new Stratagem(EStratagem.RocketSentry, "swdda"),
        new Stratagem(EStratagem.EMSMortarSentry, "swdsd"),
        new Stratagem(EStratagem.PatriotExosuit, "asdwass"),
        new Stratagem(EStratagem.EmancipatorExosuit, "asdwasw"),
        new Stratagem(EStratagem.Sterilizer, "sawsa"),
        new Stratagem(EStratagem.GuardDogBreath, "swawdw"),
        new Stratagem(EStratagem.DirectionalShield, "swadww"),
        new Stratagem(EStratagem.AntiTankEmplacement, "swaddd"),
        new Stratagem(EStratagem.FlameSentry, "swdsww"),
        new Stratagem(EStratagem.PortableHellbomb, "sdwww"),
        new Stratagem(EStratagem.SoSBeacon, "wsdw"),
        new Stratagem(EStratagem.Resupply, "sswd"),
        new Stratagem(EStratagem.EagleRearm, "wwawd"),
        new Stratagem(EStratagem.SSSDDelivery, "sssww"),
        new Stratagem(EStratagem.ProspectingDrill, "ssadss"),
        new Stratagem(EStratagem.SuperEarthFlag, "swsw"),
        new Stratagem(EStratagem.Hellbomb, "swaswdsw"),
        new Stratagem(EStratagem.UploadData, "adwww"),
        new Stratagem(EStratagem.SeismicProbe, "wwadss"),
        new Stratagem(EStratagem.OrbitalIlluminationFlare, "ddaa"),
        new Stratagem(EStratagem.SEAFArtillery, "dwws"),
        new Stratagem(EStratagem.DarkFluidVessel, "wadsww"),
        new Stratagem(EStratagem.TectonicDrill, "wswsws"),
        new Stratagem(EStratagem.HiveBreakerDrill, "awsdss"),
    };
}