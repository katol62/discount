CREATE TABLE `cards` (
  `cid` int(11) NOT NULL,
  `qr_code` varchar(128) NOT NULL,
  `nfs_code` varchar(64) NOT NULL,
  `m_code` varchar(128) NOT NULL,
  `card_nb` varchar(128) NOT NULL,
  `oid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `transh` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `cards`
  ADD PRIMARY KEY (`cid`),
  ADD UNIQUE KEY `qr_code` (`qr_code`);

ALTER TABLE `cards`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `transh` (
  `id` int(11) NOT NULL,
  `oid` int(11) NOT NULL,
  `start_number` int(11) NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `transh`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `transh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;