using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

namespace Hellthrower.Models;

public partial class Stratagem : ObservableObject
{
    private Stratagem(EStratagem stratagemEnum, string sequence)
    {
        _sequence = sequence;
        _stratagemEnum = stratagemEnum;
    }
    
    [ObservableProperty] private string _sequence;
    [ObservableProperty] private EStratagem _stratagemEnum;

    public static ObservableCollection<Stratagem> Stratagems { get; private set; } = new()
    {
        new Stratagem(EStratagem.MG43MachineGun, "saswd"),
        new Stratagem(EStratagem.APW1AntiMaterielRifle, "sadws"),
        new Stratagem(EStratagem.M105Stalwart, "saswwa"),
        new Stratagem(EStratagem.EAT17ExpendableAntiTank, "ssawd"),
        new Stratagem(EStratagem.GR8RecoillessRifle, "sadda"),
        new Stratagem(EStratagem.FLAM40Flamethrower, "sawsw"),
        new Stratagem(EStratagem.AC8Autocannon, "saswwd"),
        new Stratagem(EStratagem.G206HeavyMachineGun, "sawss"),
        new Stratagem(EStratagem.L77AirburstRocketLauncher, "swwad"),
        new Stratagem(EStratagem.LS4XCommando, "sawsd"),
        new Stratagem(EStratagem.RS422Railgun, "sdswad"),
        new Stratagem(EStratagem.FAF14Spear, "sswss"),
        new Stratagem(EStratagem.StAX3WASPLauncher, "sswsd"),
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
        new Stratagem(EStratagem.LIFT850JumpPack, "swwsw"),
        new Stratagem(EStratagem.EagleSmokeStrike, "wdws"),
        new Stratagem(EStratagem.Eagle110mmRocketPods, "wdwa"),
        new Stratagem(EStratagem.Eagle500kgBomb, "wdsss"),
        new Stratagem(EStratagem.M102FastReconVehicle, "asdsdsw"),
        new Stratagem(EStratagem.OrbitalPrecisionStrike, "ddw"),
        new Stratagem(EStratagem.OrbitalGasStrike, "ddsd"),
        new Stratagem(EStratagem.OrbitalEMSStrike, "ddas"),
        new Stratagem(EStratagem.OrbitalSmokeStrike, "ddsw"),
        new Stratagem(EStratagem.EMG101HMGEmplacement, "swadda"),
        new Stratagem(EStratagem.FX12ShieldGeneratorRelay, "ssadad"),
        new Stratagem(EStratagem.AARC3TeslaTower, "swdwad"),
        new Stratagem(EStratagem.MD6AntiPersonnelMinefield, "sawd"),
        new Stratagem(EStratagem.B1SupplyPack, "saswws"),
        new Stratagem(EStratagem.GL21GrenadeLauncher, "sawas"),
        new Stratagem(EStratagem.LAS98LaserCannon, "saswa"),
        new Stratagem(EStratagem.MDI4IncendiaryMines, "saas"),
        new Stratagem(EStratagem.AXLAS5GuardDogRover, "swawdd"),
        new Stratagem(EStratagem.SH20BallisticShieldBackpack, "sasswa"),
        new Stratagem(EStratagem.ARC3ArcThrower, "sdswaa"),
        new Stratagem(EStratagem.MD17AntiTankMines, "saww"),
        new Stratagem(EStratagem.AS99QuasarCannon, "sswad"),
        new Stratagem(EStratagem.SH32ShieldGeneratorPack, "swadad"),
        new Stratagem(EStratagem.MD8GasMines, "saad"),
        new Stratagem(EStratagem.AMG43MachineGunSentry, "swddw"),
        new Stratagem(EStratagem.AG16GatlingSentry, "swda"),
        new Stratagem(EStratagem.AM12MortarSentry, "swdds"),
        new Stratagem(EStratagem.AXAR23GuardDog, "swawds"),
        new Stratagem(EStratagem.AAC8AutocannonSentry, "swdwaw"),
        new Stratagem(EStratagem.AMLS4XRocketSentry, "swdda"),
        new Stratagem(EStratagem.AM23EMSMortarSentry, "swdsd"),
        new Stratagem(EStratagem.EXO45PatriotExosuit, "asdwass"),
        new Stratagem(EStratagem.EXO49EmancipatorExosuit, "asdwasw"),
        new Stratagem(EStratagem.TX41Sterilizer, "sawsa"),
        new Stratagem(EStratagem.AXTX13GuardDogDogBreath, "swawdw"),
        new Stratagem(EStratagem.SH51DirectionalShield, "swadww"),
        new Stratagem(EStratagem.EAT12AntiTankEmplacement, "swaddd"),
        new Stratagem(EStratagem.AFLAM40FlameSentry, "swdsww"),
        new Stratagem(EStratagem.B100PortableHellbomb, "sdwww"),
        new Stratagem(EStratagem.SoSBeacon, "wsdw"),
        new Stratagem(EStratagem.Resupply, "sswd"),
        new Stratagem(EStratagem.EagleRearm, "wwawd"),
        new Stratagem(EStratagem.svgSSSDDelivery, "sssww"),
        new Stratagem(EStratagem.ProspectingDrill, "ssadss"),
        new Stratagem(EStratagem.SuperEarthFlag, "swsw"),
        new Stratagem(EStratagem.Hellbomb, "swaswdsw"),
        new Stratagem(EStratagem.svgUploadData, "adwww"),
        new Stratagem(EStratagem.SeismicProbe, "wwadss"),
        new Stratagem(EStratagem.OrbitalIlluminationFlare, "ddaa"),
        new Stratagem(EStratagem.SEAFArtillery, "dwws"),
        new Stratagem(EStratagem.DarkFluidVessel, "wadsww"),
        new Stratagem(EStratagem.TectonicDrill, "wswsws"),
        new Stratagem(EStratagem.HiveBreakerDrill, "awsdss"),
    };
}