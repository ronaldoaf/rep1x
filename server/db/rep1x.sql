-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 26, 2019 at 02:22 PM
-- Server version: 10.2.17-MariaDB
-- PHP Version: 7.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u415170357_rep1x`
--

-- --------------------------------------------------------

--
-- Table structure for table `apostas`
--

CREATE TABLE `apostas` (
  `id` int(11) NOT NULL,
  `data_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `GameId` int(11) NOT NULL,
  `Type` smallint(6) NOT NULL,
  `Coef` float NOT NULL,
  `Param` float NOT NULL,
  `PlayerId` tinyint(4) NOT NULL,
  `Kind` tinyint(4) NOT NULL,
  `Expired` tinyint(4) NOT NULL,
  `InstrumentId` tinyint(4) NOT NULL,
  `Seconds` tinyint(4) NOT NULL,
  `partner` tinyint(4) NOT NULL,
  `CfView` tinyint(4) NOT NULL,
  `Lng` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Vid` tinyint(4) NOT NULL,
  `Source` smallint(6) NOT NULL,
  `CheckCf` tinyint(4) NOT NULL,
  `Live` tinyint(4) NOT NULL,
  `notWait` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contas`
--

CREATE TABLE `contas` (
  `id` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `senha` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moeda` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endereco` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saldos`
--

CREATE TABLE `saldos` (
  `numero_conta` int(11) NOT NULL,
  `saldo` decimal(4,2) NOT NULL,
  `data_hora` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apostas`
--
ALTER TABLE `apostas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `GameId` (`GameId`,`Type`,`Param`),
  ADD KEY `data_hora` (`data_hora`);

--
-- Indexes for table `contas`
--
ALTER TABLE `contas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`);

--
-- Indexes for table `saldos`
--
ALTER TABLE `saldos`
  ADD PRIMARY KEY (`numero_conta`,`data_hora`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apostas`
--
ALTER TABLE `apostas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contas`
--
ALTER TABLE `contas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
