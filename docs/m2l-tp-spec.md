# M2L TP - Spécification d'Infrastructure Réseau

## Vue d'ensemble

### Description générale

L'infrastructure M2L (Maison des Ligues de Lorraine) est organisée autour de deux pôles principaux :
- **Pôle M2L** : Infrastructure partagée pour l'administration et les services communs
- **Pôle Ligues** : Infrastructure dédiée aux différentes ligues sportives

**Caractéristiques :**
- 4 bâtiments interconnectés
- Domaine Active Directory : `M2L.local`
- Annuaire : LDAP
- Architecture redondante avec HSRP et spanning-tree

---

## Architecture réseau

### Hiérarchie des VLANs

| VLAN ID | Nom | Description | Réseau |
|---------|-----|-------------|--------|
| VLAN 2 | Informatique M2L | Infrastructure informatique M2L | 172.16.2.224/27 |
| VLAN 5 | VOIP | Téléphonie sur IP | - |
| VLAN 10 | Ligue 1 | Première ligue sportive | 172.16.10.0/24 |
| VLAN 11 | Ligue 2 | Deuxième ligue sportive | 172.16.11.0/24 |
| VLAN 12 | Ligue 3 | Troisième ligue sportive | 172.16.12.0/24 |
| VLAN 13 | WiFi 1 | Premier réseau WiFi | - |
| VLAN 14 | WiFi 2 | Second réseau WiFi | - |
| VLAN 99 | Gestion | Réseau de gestion des équipements | - |

**Notes :**
- Capacité d'extension jusqu'à 32 VLANs pour les ligues
- VLANs ligues numérotés de 10 à 41 (potentiellement)

### Plan d'adressage IP

#### Réseau global
- **Réseau global M2L :** 172.16.0.0/16

#### Réseaux par ligue (VLANs 10-41)

| Type d'adresse | Plage | Usage |
|----------------|-------|-------|
| DHCP | .1 - .60 | Attribution dynamique postes utilisateurs |
| Réservé | .61 - .239 | Réservé pour usage futur |
| IP fixes | .240 - .254 | Serveurs, imprimantes, équipements |

**Exemple pour VLAN 10 (172.16.10.0/24) :**
- DHCP : 172.16.10.1 - 172.16.10.60
- Fixes : 172.16.10.240 - 172.16.10.254

#### DMZ - Zone démilitarisée

| DMZ | Réseau | Usage |
|-----|--------|-------|
| DMZ Publique | 192.168.0.0/29 | Services accessibles depuis Internet |
| DMZ Privée | 192.168.1.0/29 | Services internes sécurisés |

**Services DMZ :**
- Serveur FTP
- HAProxy (reverse proxy pour serveurs WEB)
- Site vitrine M2L

#### Réseaux de gestion et interconnexion

| Réseau | Usage |
|--------|-------|
| VLAN 99 | Gestion des équipements réseau |
| Réseaux d'interconnexion | Liaison entre routeurs et switches |

---

## Routage et redondance

### Technologies mises en œuvre

| Technologie | Description |
|-------------|-------------|
| **802.1Q** | Sous-interfaces pour le trunking VLAN sur les routeurs |
| **HSRP** | Hot Standby Router Protocol pour la redondance des routeurs |
| **Spanning-Tree** | Boucle de prévention sur les switches SWLIGUES |

**Architecture :**
- Deux routeurs principaux en HSRP pour la haute disponibilité
- Trunks 802.1Q entre switches et routeurs
- Spanning-tree pour éviter les boucles au niveau des switches des ligues

---

## DMZ et accès Internet

### Pare-feu périphérique
- **Solution :** pfSense
- **Rôle :** Filtrage et sécurisation des flux Internet

### Services DMZ accessibles depuis l'extérieur

| Service | Protocole | Accès |
|---------|-----------|-------|
| FTP | FTP/FTPS | Depuis Internet (avec restrictions) |
| Site vitrine M2L | HTTP/HTTPS | Depuis Internet via HAProxy |
| HAProxy | HTTP/HTTPS | Reverse proxy pour les serveurs WEB internes |

### Conditions d'accès internes à la DMZ
- Les utilisateurs internes peuvent accéder aux services DMZ selon les règles de sécurité
- Segmentation entre DMZ publique et privée

---

## Règles de contrôle d'accès

### Accès Internet

| Source | Destination | Autorisation |
|--------|-------------|--------------|
| Réseau interne (tous VLANs) | Internet | ✅ Autorisé |
| Internet | DMZ (site vitrine M2L) | ✅ Autorisé |
| Internet | Réseau interne | ❌ Interdit (sauf DMZ) |
| Internet (ICMP) | Tous réseaux | ❌ Bloqué (protection anti-scan) |

### Inter-connectivité des ligues

| Source | Destination | Autorisation |
|--------|-------------|--------------|
| VLAN 10 | VLAN 11 | ✅ Autorisé |
| VLAN 11 | VLAN 10 | ✅ Autorisé |
| VLAN 11 | VLAN 12 | ✅ Autorisé |
| VLAN 12 | VLAN 11 | ✅ Autorisé |
| VLAN 10 | VLAN 12 | ❌ Interdit |
| VLAN 12 | VLAN 10 | ❌ Interdit |

**Règle générale :**
- Les ligues adjacentes (N et N+1) peuvent communiquer entre elles
- Les ligues non adjacentes sont isolées (ex: VLAN 10 et VLAN 12)

### Accès externes

| Source | Destination | Règle |
|--------|-------------|-------|
| Internet | DMZ publique | Uniquement vers site vitrine M2L |
| Internet | Services M2L internes | ❌ Interdit |

---

## Infrastructure de maintenance et supervision

### Outils déployés

| Outil | Fonction | Type |
|-------|----------|------|
| **GLPI** | Gestion des tickets et inventaire | ITSM |
| **OCS Inventory** | Inventaire automatique du parc | Inventaire |
| **Zabbix** | Supervision infrastructure et alertes | Monitoring |
| **SNMP** | Protocole de supervision équipements réseau | Protocole |
| **Wireshark** | Analyse de paquets et troubleshooting | Analyse réseau |
| **SSH** | Administration sécurisée des serveurs | Accès distant |
| **Snort** | Système de détection d'intrusion (IDS) | Sécurité |

### Stratégie de supervision
- Monitoring actif via Zabbix sur tous les équipements critiques
- SNMP activé sur switches et routeurs
- IDS Snort pour la détection des anomalies réseau
- Centralisation des logs

---

## Inventaire des serveurs

### Serveurs M2L - Infrastructure

| Serveur | Adresse IP | Nom DNS | Fonction | VLAN |
|---------|------------|---------|----------|------|
| Serveur AD/LDAP | 172.16.2.225 | dc01.m2l.local | Contrôleur de domaine | VLAN 2 |
| Serveur DHCP | 172.16.2.226 | dhcp01.m2l.local | Attribution IP dynamique | VLAN 2 |
| Serveur DNS | 172.16.2.227 | dns01.m2l.local | Résolution de noms | VLAN 2 |
| Serveur fichiers | 172.16.2.228 | files01.m2l.local | Partage de fichiers | VLAN 2 |
| Serveur GLPI | 172.16.2.229 | glpi.m2l.local | ITSM et ticketing | VLAN 2 |
| Serveur Zabbix | 172.16.2.230 | zabbix.m2l.local | Supervision | VLAN 2 |

### Serveurs DMZ

| Serveur | Adresse IP | Nom DNS | Fonction | DMZ |
|---------|------------|---------|----------|-----|
| Serveur FTP | 192.168.0.2 | ftp.m2l.local | Transfert de fichiers | Publique |
| HAProxy | 192.168.0.3 | proxy.m2l.local | Reverse proxy WEB | Publique |
| Serveur WEB vitrine | 192.168.0.4 | www.m2l.local | Site public M2L | Publique |
| Serveur WEB interne | 192.168.1.2 | intranet.m2l.local | Applications internes | Privée |

### Serveurs ligues (exemple pour VLAN 10)

| Serveur | Adresse IP | Nom DNS | Fonction |
|---------|------------|---------|----------|
| Serveur fichiers ligue 1 | 172.16.10.240 | files-l1.m2l.local | Stockage ligue 1 |
| Imprimante ligue 1 | 172.16.10.241 | print-l1.m2l.local | Impression ligue 1 |

**Note :** Schéma similaire pour les autres ligues (VLANs 11, 12, etc.)

---

## Schémas réseau

### Schéma général de l'infrastructure

<img src="images/m2l-schema-general.png" alt="Schéma général de l'infrastructure M2L" width="800">

### Schéma détaillé des interconnexions

<img src="images/m2l-schema-interconnexions.png" alt="Schéma détaillé des interconnexions M2L" width="800">

---

## Évolutions futures

Ce document est destiné à être complété avec :
- Spécifications détaillées des configurations matérielles
- Procédures de déploiement
- Plans de reprise d'activité (PRA/PCA)
- Audits de sécurité
- Procédures de maintenance

---

**Date de création :** 2026-02-19  
**Version :** 1.0  
**Statut :** Document de référence initial
