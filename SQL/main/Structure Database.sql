-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 27, 2023 at 11:08 PM
-- Server version: 8.0.34-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gap_dev1163`
--

-- --------------------------------------------------------

--
-- Table structure for table `acc_doctor`
--

CREATE TABLE `acc_doctor` (
  `id_table_doctor` int NOT NULL,
  `id_doctor` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `uid_line_doctor` varchar(50) NOT NULL,
  `password_doctor` varchar(256) NOT NULL,
  `fullname_doctor` varchar(50) NOT NULL,
  `station_doctor` varchar(50) NOT NULL,
  `img_doctor` longblob NOT NULL,
  `status_account` tinyint(1) NOT NULL,
  `status_delete` tinyint(1) NOT NULL,
  `time_online` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `acc_farmer`
--

CREATE TABLE `acc_farmer` (
  `id_table` int NOT NULL,
  `id_farmer` varchar(50) NOT NULL,
  `id_table_doctor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `img` longblob NOT NULL,
  `station` varchar(50) NOT NULL,
  `location` point NOT NULL,
  `password` varchar(256) NOT NULL,
  `register_auth` tinyint(1) NOT NULL,
  `date_register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_doctor_confirm` varchar(100) NOT NULL,
  `uid_line` varchar(255) NOT NULL,
  `link_user` varchar(50) NOT NULL,
  `tel_number` varchar(15) NOT NULL,
  `text_location` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `because_delete`
--

CREATE TABLE `because_delete` (
  `id` int NOT NULL,
  `id_table_doctor` varchar(50) NOT NULL,
  `id_admin` varchar(50) NOT NULL,
  `because_text` longtext NOT NULL,
  `date` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `because_status`
--

CREATE TABLE `because_status` (
  `id` int NOT NULL,
  `id_table_doctor` varchar(50) NOT NULL,
  `id_admin` varchar(50) NOT NULL,
  `because_text` longtext NOT NULL,
  `date` varchar(50) NOT NULL,
  `type_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `check_form_detail`
--

CREATE TABLE `check_form_detail` (
  `id` int NOT NULL,
  `id_plant` varchar(50) NOT NULL,
  `status_check` int NOT NULL,
  `note_text` longtext NOT NULL,
  `id_table_doctor` int NOT NULL,
  `date_check` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `check_plant_detail`
--

CREATE TABLE `check_plant_detail` (
  `id` int NOT NULL,
  `id_plant` varchar(50) NOT NULL,
  `status_check` int NOT NULL,
  `state_check` tinyint(1) NOT NULL,
  `note_text` longtext NOT NULL,
  `id_table_doctor` int NOT NULL,
  `date_check` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chemical_list`
--

CREATE TABLE `chemical_list` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `name_formula` varchar(50) NOT NULL,
  `how_use` longtext NOT NULL,
  `date_safe_list` int NOT NULL,
  `is_use` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detailedit`
--

CREATE TABLE `detailedit` (
  `id_detail` int NOT NULL,
  `id_edit` int NOT NULL,
  `subject_form` varchar(20) NOT NULL,
  `old_content` varchar(100) NOT NULL,
  `new_content` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `editform`
--

CREATE TABLE `editform` (
  `id_edit` int NOT NULL,
  `id_form` varchar(50) NOT NULL,
  `id_doctor` varchar(50) NOT NULL,
  `because` varchar(100) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `note` varchar(100) NOT NULL,
  `status` int NOT NULL,
  `type_form` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fertilizer_list`
--

CREATE TABLE `fertilizer_list` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `name_formula` varchar(50) NOT NULL,
  `how_use` longtext NOT NULL,
  `is_use` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `formchemical`
--

CREATE TABLE `formchemical` (
  `id` int NOT NULL,
  `id_plant` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `formula_name` varchar(50) NOT NULL,
  `insect` varchar(100) NOT NULL,
  `use_is` varchar(100) NOT NULL,
  `rate` varchar(20) NOT NULL,
  `volume` varchar(100) NOT NULL,
  `date_safe` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `source` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `formfertilizer`
--

CREATE TABLE `formfertilizer` (
  `id` int NOT NULL,
  `id_plant` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `formula_name` varchar(50) NOT NULL,
  `use_is` varchar(100) NOT NULL,
  `volume` varchar(100) NOT NULL,
  `source` varchar(100) NOT NULL,
  `date` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `formplant`
--

CREATE TABLE `formplant` (
  `id` varchar(50) NOT NULL,
  `id_farm_house` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name_plant` varchar(50) NOT NULL,
  `generation` int NOT NULL,
  `date_glow` varchar(50) NOT NULL,
  `date_plant` varchar(50) NOT NULL,
  `posi_w` float NOT NULL,
  `posi_h` float NOT NULL,
  `qty` int NOT NULL,
  `area` float NOT NULL,
  `date_harvest` varchar(50) NOT NULL,
  `system_glow` varchar(50) NOT NULL,
  `water` varchar(50) NOT NULL,
  `water_flow` varchar(50) NOT NULL,
  `history` varchar(50) NOT NULL,
  `insect` varchar(50) NOT NULL,
  `qtyInsect` varchar(50) NOT NULL,
  `seft` varchar(200) NOT NULL,
  `state_status` int NOT NULL,
  `date_success` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `housefarm`
--

CREATE TABLE `housefarm` (
  `id_farm_house` int NOT NULL,
  `uid_line` varchar(255) NOT NULL,
  `link_user` varchar(50) NOT NULL,
  `name_house` varchar(50) NOT NULL,
  `img_house` longblob NOT NULL,
  `location` point DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_admin`
--

CREATE TABLE `log_admin` (
  `id` int NOT NULL,
  `admin_id` int NOT NULL,
  `date` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_user`
--

CREATE TABLE `message_user` (
  `id` int NOT NULL,
  `message` longtext NOT NULL,
  `uid_line_farmer` varchar(255) DEFAULT NULL,
  `id_read` json NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(50) NOT NULL,
  `type_message` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notify_doctor`
--

CREATE TABLE `notify_doctor` (
  `id` int NOT NULL,
  `id_table_farmer` int NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_read` json NOT NULL,
  `notify` longtext NOT NULL,
  `station` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `plant_list`
--

CREATE TABLE `plant_list` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_use` tinyint(1) NOT NULL,
  `type_plant` varchar(20) NOT NULL,
  `qty_harvest` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_detail`
--

CREATE TABLE `report_detail` (
  `id` int NOT NULL,
  `id_plant` varchar(50) NOT NULL,
  `report_text` longtext NOT NULL,
  `id_table_doctor` int NOT NULL,
  `date_report` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_path` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `source_list`
--

CREATE TABLE `source_list` (
  `id` int NOT NULL,
  `name` varchar(80) NOT NULL,
  `is_use` tinyint(1) NOT NULL,
  `location` point DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `station_list`
--

CREATE TABLE `station_list` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_use` tinyint(1) NOT NULL,
  `location` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `success_detail`
--

CREATE TABLE `success_detail` (
  `id` int NOT NULL,
  `id_success` varchar(100) NOT NULL,
  `id_plant` varchar(50) NOT NULL,
  `type_success` tinyint(1) NOT NULL,
  `id_table_doctor` int NOT NULL,
  `date_of_doctor` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_of_farmer` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acc_doctor`
--
ALTER TABLE `acc_doctor`
  ADD PRIMARY KEY (`id_table_doctor`);

--
-- Indexes for table `acc_farmer`
--
ALTER TABLE `acc_farmer`
  ADD PRIMARY KEY (`id_table`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `because_delete`
--
ALTER TABLE `because_delete`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `because_status`
--
ALTER TABLE `because_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `check_form_detail`
--
ALTER TABLE `check_form_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `check_plant_detail`
--
ALTER TABLE `check_plant_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chemical_list`
--
ALTER TABLE `chemical_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `detailedit`
--
ALTER TABLE `detailedit`
  ADD PRIMARY KEY (`id_detail`);

--
-- Indexes for table `editform`
--
ALTER TABLE `editform`
  ADD PRIMARY KEY (`id_edit`);

--
-- Indexes for table `fertilizer_list`
--
ALTER TABLE `fertilizer_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `formchemical`
--
ALTER TABLE `formchemical`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `formfertilizer`
--
ALTER TABLE `formfertilizer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `formplant`
--
ALTER TABLE `formplant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `housefarm`
--
ALTER TABLE `housefarm`
  ADD PRIMARY KEY (`id_farm_house`);

--
-- Indexes for table `log_admin`
--
ALTER TABLE `log_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `message_user`
--
ALTER TABLE `message_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notify_doctor`
--
ALTER TABLE `notify_doctor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plant_list`
--
ALTER TABLE `plant_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `report_detail`
--
ALTER TABLE `report_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `source_list`
--
ALTER TABLE `source_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `station_list`
--
ALTER TABLE `station_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `success_detail`
--
ALTER TABLE `success_detail`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acc_doctor`
--
ALTER TABLE `acc_doctor`
  MODIFY `id_table_doctor` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `acc_farmer`
--
ALTER TABLE `acc_farmer`
  MODIFY `id_table` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `because_delete`
--
ALTER TABLE `because_delete`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `because_status`
--
ALTER TABLE `because_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `check_form_detail`
--
ALTER TABLE `check_form_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `check_plant_detail`
--
ALTER TABLE `check_plant_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chemical_list`
--
ALTER TABLE `chemical_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detailedit`
--
ALTER TABLE `detailedit`
  MODIFY `id_detail` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `editform`
--
ALTER TABLE `editform`
  MODIFY `id_edit` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fertilizer_list`
--
ALTER TABLE `fertilizer_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formchemical`
--
ALTER TABLE `formchemical`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formfertilizer`
--
ALTER TABLE `formfertilizer`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `housefarm`
--
ALTER TABLE `housefarm`
  MODIFY `id_farm_house` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_admin`
--
ALTER TABLE `log_admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_user`
--
ALTER TABLE `message_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notify_doctor`
--
ALTER TABLE `notify_doctor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plant_list`
--
ALTER TABLE `plant_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report_detail`
--
ALTER TABLE `report_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `source_list`
--
ALTER TABLE `source_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `station_list`
--
ALTER TABLE `station_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `success_detail`
--
ALTER TABLE `success_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `log_admin`
--
ALTER TABLE `log_admin`
  ADD CONSTRAINT `log_admin_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO `admin` (username , password , phone , address) VALUES ('admin' , SHA2('admin', 256) , '0902959765' , POINT(0000 , 0000))
