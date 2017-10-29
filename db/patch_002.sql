CREATE TABLE `tariff` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `start` date NOT NULL,
  `end` date NOT NULL,
  `type` enum('adult','child','other') NOT NULL DEFAULT 'adult',
  `discount` int(11) NOT NULL,
  `organization` int(11) NOT NULL,
  `owner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `tariff`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `tariff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;