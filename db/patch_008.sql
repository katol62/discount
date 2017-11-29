--
-- Table structure for table `loc_states`
--
DROP TABLE IF EXISTS `loc_states`;
CREATE TABLE `loc_states` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Indexes for table `loc_states`
--
ALTER TABLE `loc_states`
  ADD PRIMARY KEY (`id`);
--
-- AUTO_INCREMENT for table `loc_states`
--
ALTER TABLE `loc_states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- INSERT INTO table `loc_states`
--
INSERT INTO `loc_states` (`id`, `name`) VALUES (NULL, 'Российская федерация');

--
-- Table structure for table `loc_fos`
--
DROP TABLE IF EXISTS `loc_fos`;
CREATE TABLE `loc_fos` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `state` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Indexes for table `loc_fos`
--
ALTER TABLE `loc_fos`
  ADD PRIMARY KEY (`id`);
--
-- AUTO_INCREMENT for table `loc_fos`
--
ALTER TABLE `loc_fos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- INSERT INTO table `loc_fos`
--
INSERT INTO `loc_fos` (`id`, `name`, `state`) VALUES (NULL, 'Южный федеральный округ', 1);
INSERT INTO `loc_fos` (`id`, `name`, `state`) VALUES (NULL, 'Северо-Кавказский федеральный округ', 1);

--
-- Table structure for table `loc_regions`
--
DROP TABLE IF EXISTS `loc_regions`;
CREATE TABLE `loc_regions` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `foc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Indexes for table `loc_regions`
--
ALTER TABLE `loc_regions`
  ADD PRIMARY KEY (`id`);
--
-- AUTO_INCREMENT for table `loc_regions`
--
ALTER TABLE `loc_regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- INSERT INTO table `loc_regions`
--
INSERT INTO `loc_regions` (`id`, `name`, `foc`) VALUES (NULL, 'Республика Крым', 1);
INSERT INTO `loc_regions` (`id`, `name`, `foc`) VALUES (NULL, 'Севастополь', 1);

--
-- UPDATE table `organization`
--
ALTER TABLE `organization` ADD `country` INT NOT NULL AFTER `name`, ADD `foc` INT NOT NULL AFTER `country`, ADD `region` INT NOT NULL AFTER `foc`;